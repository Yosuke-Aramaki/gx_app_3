class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate, only: [:create]
  
  def index
   
  end

  # ユーザー登録
  def create
    @user = User.new(user_params)
    if @user.save
      render json: { user_id: @user.id }
    else
      render json: { messages: @user.errors }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
