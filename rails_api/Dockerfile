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
RUN bundler install
RUN bundle install

COPY . /leo

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]

# wheneverでcrontab書き込み
RUN bundle exec whenever --update-crontab 

# cronをフォアグラウンド実行
CMD ["cron", "-f"] 
