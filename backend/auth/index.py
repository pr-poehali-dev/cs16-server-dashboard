import json
import os
import re
import urllib.request
import urllib.parse
from datetime import datetime

import psycopg2

def handler(event: dict, context) -> dict:
    '''Авторизация через Steam OpenID и управление сессиями'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Steam-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'login')
    
    if method == 'GET' and action == 'login':
        return_url = params.get('return_url', 'http://localhost:5173/auth/callback')
        realm = return_url.split('/auth')[0] if '/auth' in return_url else return_url
        
        steam_openid_url = f"https://steamcommunity.com/openid/login?{urllib.parse.urlencode({
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.mode': 'checkid_setup',
            'openid.return_to': return_url,
            'openid.realm': realm,
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
        })}"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'redirect_url': steam_openid_url}),
            'isBase64Encoded': False
        }
    
    if method == 'POST' and action == 'verify':
        body = json.loads(event.get('body', '{}'))
        claimed_id = body.get('openid.claimed_id', '')
        
        steam_id_match = re.search(r'steamcommunity.com/openid/id/(\d+)', claimed_id)
        if not steam_id_match:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid Steam ID'}),
                'isBase64Encoded': False
            }
        
        steam_id = steam_id_match.group(1)
        api_key = os.environ.get('STEAM_API_KEY')
        
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Steam API key not configured'}),
                'isBase64Encoded': False
            }
        
        try:
            api_url = f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key={api_key}&steamids={steam_id}"
            with urllib.request.urlopen(api_url) as response:
                data = json.loads(response.read())
                
            if not data.get('response', {}).get('players'):
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Player not found'}),
                    'isBase64Encoded': False
                }
            
            player = data['response']['players'][0]
            
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute(
                """
                INSERT INTO users (steam_id, username, avatar_url, updated_at)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (steam_id) 
                DO UPDATE SET username = EXCLUDED.username, 
                              avatar_url = EXCLUDED.avatar_url,
                              updated_at = EXCLUDED.updated_at
                RETURNING id, steam_id, username, avatar_url, balance, privilege, play_time, last_daily_spin
                """,
                (steam_id, player['personaname'], player['avatarfull'], datetime.now())
            )
            
            user_data = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            user = {
                'id': user_data[0],
                'steam_id': user_data[1],
                'username': user_data[2],
                'avatar_url': user_data[3],
                'balance': user_data[4],
                'privilege': user_data[5],
                'play_time': user_data[6],
                'last_daily_spin': user_data[7].isoformat() if user_data[7] else None
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'user': user}),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    if method == 'GET' and action == 'profile':
        steam_id = params.get('steam_id')
        
        if not steam_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Steam ID required'}),
                'isBase64Encoded': False
            }
        
        try:
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            
            cur.execute(
                "SELECT id, steam_id, username, avatar_url, balance, privilege, play_time, last_daily_spin FROM users WHERE steam_id = %s",
                (steam_id,)
            )
            
            user_data = cur.fetchone()
            cur.close()
            conn.close()
            
            if not user_data:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            user = {
                'id': user_data[0],
                'steam_id': user_data[1],
                'username': user_data[2],
                'avatar_url': user_data[3],
                'balance': user_data[4],
                'privilege': user_data[5],
                'play_time': user_data[6],
                'last_daily_spin': user_data[7].isoformat() if user_data[7] else None
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'user': user}),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Not found'}),
        'isBase64Encoded': False
    }