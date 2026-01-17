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
            mysql_conn = pymysql.connect(
                host=os.environ['MYSQL_HOST'],
                user=os.environ['MYSQL_USER'],
                password=os.environ['MYSQL_PASSWORD'],
                database=os.environ['MYSQL_DATABASE'],
                charset='utf8mb4'
            )
            mysql_cur = mysql_conn.cursor(pymysql.cursors.DictCursor)
            
            mysql_cur.execute("SELECT COUNT(*) as total FROM players WHERE online = 1")
            players_result = mysql_cur.fetchone()
            players_online = players_result['total'] if players_result else 0
            
            mysql_cur.execute("SELECT value FROM server_settings WHERE name = 'current_map' LIMIT 1")
            map_result = mysql_cur.fetchone()
            current_map = map_result['value'] if map_result else 'de_dust2'
            
            mysql_cur.execute("SELECT value FROM server_settings WHERE name = 'ct_score' LIMIT 1")
            ct_result = mysql_cur.fetchone()
            ct_score = int(ct_result['value']) if ct_result else 0
            
            mysql_cur.execute("SELECT value FROM server_settings WHERE name = 't_score' LIMIT 1")
            t_result = mysql_cur.fetchone()
            t_score = int(t_result['value']) if t_result else 0
            
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
                    'server_ip': os.environ.get('GAME_SERVER_IP', 'N/A')
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
