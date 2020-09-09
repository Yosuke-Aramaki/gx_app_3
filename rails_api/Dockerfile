FROM ruby:2.6.3
#rubyのバージョン指定

#gemのインストール
RUN apt-get update -qq && \
    apt-get install -y build-essential \ 
                       libpq-dev \        
                       nodejs

# cronインストール
RUN apt-get install -y cron 

RUN mkdir /leo

WORKDIR /leo

COPY Gemfile /leo/Gemfile
COPY Gemfile.lock /leo/Gemfile.lock

RUN gem install bundler
RUN bundle install

COPY . /leo

# wheneverでcrontab書き込み
RUN bundle exec whenever --update-crontab 

# cronをフォアグラウンド実行
CMD ["cron", "-f"] 

