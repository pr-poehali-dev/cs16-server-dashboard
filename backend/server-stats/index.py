import json
import os
import pymysql
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для получения статистики сервера CS 1.6 и синхронизации с MySQL'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'stats')
    
    try:
        if action == 'stats':
            try:
                mysql_conn = pymysql.connect(
                    host=os.environ.get('MYSQL_HOST', ''),
                    user=os.environ.get('MYSQL_USER', ''),
                    password=os.environ.get('MYSQL_PASSWORD', ''),
                    database=os.environ.get('MYSQL_DATABASE', ''),
                    charset='utf8mb4',
                    connect_timeout=3
                )
                mysql_cur = mysql_conn.cursor(pymysql.cursors.DictCursor)
                
                mysql_cur.execute("SHOW TABLES")
                tables = [list(t.values())[0] for t in mysql_cur.fetchall()]
                
                players_online = 0
                current_map = 'de_dust2'
                ct_score = 0
                t_score = 0
                
                if 'players' in tables:
                    try:
                        mysql_cur.execute("SELECT COUNT(*) as total FROM players WHERE online = 1")
                        result = mysql_cur.fetchone()
                        players_online = result['total'] if result else 0
                    except:
                        pass
                
                if 'server_info' in tables:
                    try:
                        mysql_cur.execute("SELECT map_name, ct_score, t_score FROM server_info ORDER BY id DESC LIMIT 1")
                        result = mysql_cur.fetchone()
                        if result:
                            current_map = result.get('map_name', current_map)
                            ct_score = result.get('ct_score', ct_score)
                            t_score = result.get('t_score', t_score)
                    except:
                        pass
                
                mysql_cur.close()
                mysql_conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'players_online': players_online,
                        'max_players': 32,
                        'current_map': current_map,
                        'ct_score': ct_score,
                        't_score': t_score,
                        'server_ip': os.environ.get('GAME_SERVER_IP', 'N/A'),
                        'mysql_connected': True,
                        'available_tables': tables
                    }),
                    'isBase64Encoded': False
                }
                
            except Exception as mysql_err:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'players_online': 0,
                        'max_players': 32,
                        'current_map': 'de_dust2',
                        'ct_score': 0,
                        't_score': 0,
                        'server_ip': os.environ.get('GAME_SERVER_IP', 'N/A'),
                        'mysql_connected': False,
                        'error': str(mysql_err)
                    }),
                    'isBase64Encoded': False
                }
        
        elif action == 'sync':
            mysql_conn = pymysql.connect(
                host=os.environ['MYSQL_HOST'],
                user=os.environ['MYSQL_USER'],
                password=os.environ['MYSQL_PASSWORD'],
                database=os.environ['MYSQL_DATABASE'],
                charset='utf8mb4'
            )
            mysql_cur = mysql_conn.cursor(pymysql.cursors.DictCursor)
            
            mysql_cur.execute("SHOW TABLES")
            tables = [list(t.values())[0] for t in mysql_cur.fetchall()]
            
            if 'players' not in tables:
                mysql_cur.close()
                mysql_conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Table players not found in MySQL database'}),
                    'isBase64Encoded': False
                }
            
            mysql_cur.execute("""
                SELECT steam_id, username, balance, privilege, play_time 
                FROM players 
                WHERE steam_id IS NOT NULL AND steam_id != ''
            """)
            players = mysql_cur.fetchall()
            
            pg_conn = psycopg2.connect(os.environ['DATABASE_URL'])
            pg_cur = pg_conn.cursor()
            
            synced_count = 0
            for player in players:
                pg_cur.execute("""
                    INSERT INTO users (steam_id, username, balance, privilege, play_time, avatar_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (steam_id) 
                    DO UPDATE SET 
                        username = EXCLUDED.username,
                        balance = EXCLUDED.balance,
                        privilege = EXCLUDED.privilege,
                        play_time = EXCLUDED.play_time
                """, (
                    player['steam_id'],
                    player['username'],
                    player.get('balance', 0),
                    player.get('privilege', 'user'),
                    player.get('play_time', 0),
                    f"https://via.placeholder.com/128"
                ))
                synced_count += 1
            
            pg_conn.commit()
            pg_cur.close()
            pg_conn.close()
            mysql_cur.close()
            mysql_conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'message': 'Sync completed',
                    'synced_players': synced_count
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'shop_items':
            pg_conn = psycopg2.connect(os.environ['DATABASE_URL'])
            pg_cur = pg_conn.cursor()
            
            pg_cur.execute("SELECT id, name, privilege_level, duration_days, price, description, features, is_active FROM privileges_shop WHERE is_active = true ORDER BY price ASC")
            items = []
            for row in pg_cur.fetchall():
                items.append({
                    'id': row[0],
                    'name': row[1],
                    'privilege_level': row[2],
                    'duration_days': row[3],
                    'price': float(row[4]),
                    'description': row[5],
                    'features': row[6] if row[6] else [],
                    'is_active': row[7]
                })
            
            pg_cur.close()
            pg_conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'items': items}),
                'isBase64Encoded': False
            }
        
        elif action == 'shop_create':
            body = json.loads(event.get('body', '{}'))
            pg_conn = psycopg2.connect(os.environ['DATABASE_URL'])
            pg_cur = pg_conn.cursor()
            
            pg_cur.execute(
                "INSERT INTO privileges_shop (name, privilege_level, duration_days, price, description, features) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (body['name'], body['privilege_level'], body['duration_days'], body['price'], body['description'], body['features'])
            )
            new_id = pg_cur.fetchone()[0]
            pg_conn.commit()
            pg_cur.close()
            pg_conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id}),
                'isBase64Encoded': False
            }
        
        elif action == 'shop_update':
            body = json.loads(event.get('body', '{}'))
            pg_conn = psycopg2.connect(os.environ['DATABASE_URL'])
            pg_cur = pg_conn.cursor()
            
            pg_cur.execute(
                "UPDATE privileges_shop SET name = %s, privilege_level = %s, duration_days = %s, price = %s, description = %s, features = %s WHERE id = %s",
                (body['name'], body['privilege_level'], body['duration_days'], body['price'], body['description'], body['features'], body['id'])
            )
            pg_conn.commit()
            pg_cur.close()
            pg_conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Updated'}),
                'isBase64Encoded': False
            }
        
        elif action == 'shop_delete':
            body = json.loads(event.get('body', '{}'))
            pg_conn = psycopg2.connect(os.environ['DATABASE_URL'])
            pg_cur = pg_conn.cursor()
            
            pg_cur.execute("UPDATE privileges_shop SET is_active = false WHERE id = %s", (body['id'],))
            pg_conn.commit()
            pg_cur.close()
            pg_conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Deleted'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unknown action'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }