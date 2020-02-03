# Register Result as a victory
curl -v 'http://localhost:5000/api/games/1/result' -sS -X PUT -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Origin: http://localhost:5000' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36' -H 'Content-Type: application/json' -H 'Accept: */*' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: http://localhost:5000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7' --data-binary '{"result":0}' --compressed > /dev/null




# Redeem prize
curl -v 'http://localhost:5000/api/games/1/playerWallet' -sS -X PUT -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Origin: http://localhost:5000' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36' -H 'Content-Type: application/json' -H 'Accept: */*' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: http://localhost:5000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7' --data-binary '{"playerWallet":"zngHnxBm5YoqD8kkiiB2KLvBNsVP3xtJ4pf"}' --compressed | python -m json.tool
