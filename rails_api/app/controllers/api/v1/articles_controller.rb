class Api::V1::ArticlesController < ApplicationController
  def test
    render plain: current_user.inspect
  end

  def index
    @user = current_user
    articles = @user.articles
    # articles = Article.where('user_id' == 1)
    render json: articles.to_json
  end

  def create 
    @article = Article.new(article_params)
    if @article.save
      render json: { user_id: @article }
    else
      render json: { messages: @article.errors }, status: :unauthorized
    end
  end

  private
  def article_params
    params.require(:article).permit(:title, :article_url, :og_image_url, :article_note, :user_id, :category_id)
  end

end
