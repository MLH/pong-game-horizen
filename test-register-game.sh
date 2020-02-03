# Create Game
echo "Creating Game"

curl 'http://localhost:5000/api/games' -sS -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Origin: http://localhost:5000' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36' -H 'Content-Type: application/json' -H 'Accept: */*' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: http://localhost:5000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7' --data-binary '{}'


echo "\n\n\n----------------\n\n\n"


# Register Player Wallet
echo "Registering player's wallet"

curl 'http://localhost:5000/api/games/1/playerWallet' -sS -X PUT -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Origin: http://localhost:5000' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36' -H 'Content-Type: application/json' -H 'Accept: */*' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: http://localhost:5000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7' --data-binary '{"playerWallet":"zngHnxBm5YoqD8kkiiB2KLvBNsVP3xtJ4pf"}' --compressed
