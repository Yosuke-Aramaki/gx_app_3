class Api::V1::CategoriesController < ApplicationController
  def create 
    @category = Category.new(category_params)
    @category.user_id = current_user.id
    if @category.save
      render json: @category.to_json
    else
      render json: { messages: @category.errors }, status: :unauthorized
    end
  end

  private
  def category_params
    params.require(:category).permit(:category_name)
  end

end
