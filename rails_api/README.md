# Rails APIのセットアップ

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
  database: leo_development

production:
  <<: *default
  database: leo_production
  username: sample
  password: <%= ENV['SAMPLE_DATABASE_PASSWORD'] %>
```

## dockerの起動

```
cd rails_api

//dockerのアプリを起動した状態で
docker-compose build --no-cache
docker-compose up -d

// RailsDBの作成
docker-compose exec app bash
bundle install --path=vendor
bundle exec rake db:create
bundle exec rake db:migrate
```

```
// DBに接続
$ mysql -u root -h 127.0.0.1
```

