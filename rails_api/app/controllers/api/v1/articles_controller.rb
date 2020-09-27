class Api::V1::ArticlesController < ApplicationController
  skip_before_action :authenticate, only: [:test]
    
  def health_check
    render json: 'test'
  end

  def index
    @user = current_user
    articles = @user.articles
    render json: articles.to_json
  end

  def all_unread_or_read_articles
    @user = current_user
    articles = @user.articles.where(is_read: params[:is_read])
    render json: articles.to_json
  end

  def categorised_articles
    @user = current_user
    articles = @user.articles.where(is_read: params[:is_read], category_id: params[:category_id])
    render json: articles.to_json
  end

  def create 
    @article = Article.new(article_params)
    @article.user_id = current_user.id
    if @article.save
      render json: @article.to_json
    else
      render json: { messages: @article.errors }, status: :unauthorized
    end
  end

  # サイトから記事を保存する場合（Rails側でスクレイピングする必要があるためcreateとは別にした）
  def save_article_from_url
    require 'mechanize'
    agent = Mechanize.new
    
    begin
      page = agent.get(params[:article][:article_url])
      og_image_url = page.at('meta[property="og:image"]')[:content]
  
      # メモがない場合はog:descriptionをメモとして保存する
      if params[:article][:article_note].empty?
        article_note = page.at('meta[property="og:description"]')[:content]
      else 
        article_note = params[:article][:article_note]
      end   
    rescue => e
      # ogがうまく取得できない場合
      og_image_url = "/logo.ico"
      article_note = ""
    end


    @article = Article.new(
      title: page.title, 
      article_url: params[:article][:article_url], 
      og_image_url: og_image_url, 
      is_read: params[:article][:is_read],
      article_note: article_note, 
      category_id: params[:article][:category_id],
      user_id: current_user.id
    )
    if @article.save
      render json: @article.to_json
    else
      render json: { messages: @article.errors }, status: :unauthorized
    end
  end

  def update
    @article = Article.find(params[:id])
    @article.update(article_params)
  end

  # 既読未読の変更、もしかしたら上記の`update`アクションに統合させても良いかも
  def update_is_read 
    @article = Article.find(params[:id])
    @article.update(is_read: params[:is_read])
  end

  # 保存しようとしてる記事がすでに保存されているかの確認
  def already_saved
    @user = current_user
    @article = current_user.articles.find_by(article_url: params[:article_url])
    render json: @article.to_json
  end

  def destroy
    @article = Article.find(params[:id])
    if @article.destroy
      render json: { messages: '削除にしました' }
    else
      render json: { messages: '削除に失敗しました' }, status: :unauthorized
    end
  end

  private
  def article_params
    params.require(:article).permit(:title, :article_url, :og_image_url, :article_note, :is_read, :category_id)
  end

end
