# gx_app_3

# 概要
情報を逃さずインプットの定着を図るアプリです。 
インターネットにある記事を保存できるあとで読む系のサービスに近いですが、記事の内容を覚えるためにメモを追加できたり、たまった記事を消化できるようにリマインド設定できたりします。 

# Developer's guide

##  インストール

```
git clone git@github.com:Yosuke-Aramaki/gx_app_3.git
cd gx_app_3
git checkout development
```

## rbenv, MySQLのインストール

*インストール済の方はこの手順を飛ばしてください

```
// rbenvのインストール
$ rbenv install 1.1.2
$ rbenv exec gem install bundler
```
```
// MySQLのインストール 
brew update
brew install mysql
brew info mysql // インストールの確認
 mysql: stable 8.0.19 (bottled)
```

## データベース設定ファイル
データベース設定ファイルを作成します

touch rails_api/config/database.yml
作業ユーザー名とパスワードを指定して作成されたファイルを下記の内容に書き換えます

```
default: &default
  adapter: mysql2
  encoding: utf8mb4
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password: 
  host: db

development:
  <<: *default
  database: pilee_development

production:
  <<: *default
  database: pilee_production
  username: sample
  password: <%= ENV['SAMPLE_DATABASE_PASSWORD'] %>
```

## dockerの起動

```
cd rails_api

//dockerのアプリを起動した状態で
docker-compose build

docker-compose -up d

// RailsDBの作成
docker-compose run app rails db:create
docker-compose run app rails db:migrate
```

```
// DBに接続
$ mysql -u root -h 127.0.0.1
```

## フロントエンドの起動

```
cd frontend
npm install
npm run dev
```

## Chrome Extension

・[chrome://extensions/]に移動 
・右上でデベロッパーモードに起動 
・「パッケージ化されてない拡張機能を読み込む」ボタンをおす 
・「gx_app_3/extension」を選択 
・[chrome-extension://ID/index.html]にてデバッグ 

