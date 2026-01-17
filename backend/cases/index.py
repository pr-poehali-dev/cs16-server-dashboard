import json
import os
import random
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API для управления кейсами и ежедневной рулетки'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'items')
    
    import psycopg2
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET' and action == 'items':
            cur.execute(
                "SELECT id, name, description, rarity, item_type, value, chance, icon, is_active FROM case_items WHERE is_active = true ORDER BY chance ASC"
            )
            items = []
            for row in cur.fetchall():
                items.append({
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'rarity': row[3],
                    'type': row[4],
                    'value': row[5],
                    'chance': float(row[6]),
                    'icon': row[7],
                    'is_active': row[8]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'items': items}),
                'isBase64Encoded': False
            }
        
        if method == 'POST' and action == 'spin':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT last_daily_spin FROM users WHERE id = %s", (user_id,))
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            last_spin = result[0]
            now = datetime.now()
            
            if last_spin and (now - last_spin) < timedelta(hours=24):
                time_left = timedelta(hours=24) - (now - last_spin)
                hours = int(time_left.total_seconds() // 3600)
                minutes = int((time_left.total_seconds() % 3600) // 60)
                
                return {
                    'statusCode': 429,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'error': 'Daily limit reached',
                        'time_left': f'{hours}ч {minutes}м'
                    }),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, name, description, rarity, item_type, value, chance, icon FROM case_items WHERE is_active = true"
            )
            items = cur.fetchall()
            
            if not items:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No active items'}),
                    'isBase64Encoded': False
                }
            
            total_chance = sum(float(item[6]) for item in items)
            rand = random.uniform(0, total_chance)
            
            cumulative = 0
            won_item = None
            for item in items:
                cumulative += float(item[6])
                if rand <= cumulative:
                    won_item = item
                    break
            
            if not won_item:
                won_item = items[-1]
            
            cur.execute(
                "INSERT INTO case_history (user_id, case_item_id) VALUES (%s, %s)",
                (user_id, won_item[0])
            )
            
            if won_item[4] == 'balance':
                cur.execute(
                    "UPDATE users SET balance = balance + %s, last_daily_spin = %s WHERE id = %s",
                    (won_item[5], now, user_id)
                )
            elif won_item[4] == 'privilege':
                cur.execute(
                    "UPDATE users SET privilege = %s, last_daily_spin = %s WHERE id = %s",
                    (won_item[1].lower().split()[0], now, user_id)
                )
            else:
                cur.execute(
                    "UPDATE users SET last_daily_spin = %s WHERE id = %s",
                    (now, user_id)
                )
            
            conn.commit()
            
            result = {
                'id': won_item[0],
                'name': won_item[1],
                'description': won_item[2],
                'rarity': won_item[3],
                'type': won_item[4],
                'value': won_item[5],
                'chance': float(won_item[6]),
                'icon': won_item[7]
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'item': result}),
                'isBase64Encoded': False
            }
        
        if method == 'GET' and action == 'history':
            user_id = params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User ID required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                SELECT ch.won_at, ci.name, ci.rarity, ci.value 
                FROM case_history ch
                JOIN case_items ci ON ch.case_item_id = ci.id
                WHERE ch.user_id = %s
                ORDER BY ch.won_at DESC
                LIMIT 50
                """,
                (user_id,)
            )
            
            history = []
            for row in cur.fetchall():
                history.append({
                    'won_at': row[0].isoformat(),
                    'name': row[1],
                    'rarity': row[2],
                    'value': row[3]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'history': history}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()