FROM ruby:2.6.3
#rubyのバージョン指定
RUN gem install rails
#gemのインストール
RUN apt-get update && apt-get install -y nodejs mysql-client

RUN mkdir /gx_app_3
WORKDIR /gx_app_3
COPY Gemfile /gx_app_3/Gemfile
COPY Gemfile.lock /gx_app_3/Gemfile.lock
RUN bundle install
COPY . /gx_app_3