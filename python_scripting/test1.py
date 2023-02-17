import requests

x = requests.get('http://challenge01.root-me.org/web-serveur/ch2/', headers={'User-Agent': 'admin'})
print(x.text)
