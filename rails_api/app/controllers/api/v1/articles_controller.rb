class Api::V1::ArticlesController < ApplicationController
  def test
    render plain: current_user.inspect
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

  def update
    @article = Article.find(params[:id])
    @article.update(article_params)
  end

  def update_is_read 
    @article = Article.find(params[:id])
    @article.update(is_read: params[:is_read])
  end

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
