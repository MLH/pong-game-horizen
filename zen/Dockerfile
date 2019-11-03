FROM bitnami/minideb:stretch

RUN install_packages build-essential pkg-config libc6-dev m4 g++-multilib \
  autoconf libtool ncurses-dev unzip git python \
  zlib1g-dev bsdmainutils automake curl wget ca-certificates

RUN git config --global http.sslVerify false

RUN mkdir -p ~/downloads

WORKDIR /root/downloads

RUN wget https://github.com/ZencashOfficial/zen/releases/download/v2.0.19/zen-2.0.19-amd64.deb

RUN apt install ./zen-2.0.19-amd64.deb

RUN zen-fetch-params

RUN mkdir -p /root/.zen
ADD ./zen.conf /root/.zen/zen.conf

EXPOSE 8232

ENTRYPOINT [ "zend", "-debug=rpc", "-logips", "-printtoconsole", "-testnet" ]