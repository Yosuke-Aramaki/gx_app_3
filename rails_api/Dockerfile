FROM ruby:2.6.3
#rubyのバージョン指定

#gemのインストール
RUN apt-get update -qq && \
    apt-get install -y build-essential \ 
                       libpq-dev \        
                       nodejs

# cronインストール
RUN apt-get install -y cron 

RUN mkdir /gx_app_3

WORKDIR /gx_app_3

COPY Gemfile /gx_app_3/Gemfile
COPY Gemfile.lock /gx_app_3/Gemfile.lock

RUN gem install bundler
RUN bundle install --path=vendor

COPY . /gx_app_3

# wheneverでcrontab書き込み
RUN bundle exec whenever --update-crontab 

# cronをフォアグラウンド実行
CMD ["cron", "-f"] 

