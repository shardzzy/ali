from requests import get, post
from time import time
from bs4 import BeautifulSoup
import json

# Function to check passkey for a given TikTok username
def check(username):
    try:
        iid = int(bin(int(time()))[2:].zfill(32) + "0" * 32, 2)
        did = int(bin(int(time() + time() * 0.0004))[2:].zfill(32) + "0" * 32, 2)
        url = f'https://api16-normal-c-useast1a.tiktokv.com/passport/find_account/tiktok_username/?request_tag_from=h5&iid={iid}&device_id={did}&ac=wifi&channel=googleplay&aid=567753'
        payload = f'mix_mode=1&username={username}'
        r = post(url, data=payload).json()
        if r['message'] != 'success':
            return {'status': 'error', 'message': r['data']['description']}
        
        ticket = r['data']['token']
        url = f'https://api16-normal-c-useast1a.tiktokv.com/passport/auth/available_ways/?request_tag_from=h5&not_login_ticket={ticket}&iid={iid}&device_id={did}&ac=wifi&channel=googleplay&aid=567753'
        return {'status': 'success', 'passkey': get(url).json()['data']['has_passkey']}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

# Function to get general information about the TikTok account
def info(secuid):
    try:
        url = f'https://tiktok.com/@{secuid}'
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
        }
        r = get(url, headers=headers).text
        soup = BeautifulSoup(r, "html.parser")
        data = soup.find("script", {"id": "__UNIVERSAL_DATA_FOR_REHYDRATION__"})
        data = json.loads(data.string)
        user_info = data["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"]["user"]
        stats = data["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"]["stats"]

        return {
            'follower': stats.get('followerCount'),
            'following': stats.get('followingCount'),
            'likes': stats.get('heart'),
            'bio': user_info.get('signature'),
            'created': user_info.get('createTime'),
            'region': user_info.get('region'),
            'private': user_info.get('privateAccount'),
            'last_username_change': None if user_info.get('uniqueIdModifyTime') == 0 else user_info.get('uniqueIdModifyTime'),
            'last_nickname_change': user_info.get('nickNameModifyTime')
        }
    except Exception as e:
        return {
            'follower': None,
            'following': None,
            'likes': None,
            'bio': None,
            'created': None,
            'region': None,
            'private': None,
            'last_username_change': None,
            'last_nickname_change': None,
            'error': str(e)
        }

# Example usage of the functions
if __name__ == '__main__':
    # Check passkey for a username
    username_check = check('cat')
    print('Username check result:', username_check)
    
    # Get info for a TikTok account
    user_info = info('cat')
    print('User info:', user_info)
