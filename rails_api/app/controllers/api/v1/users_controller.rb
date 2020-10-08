class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate, only: [:create]
  
  def index
   
  end

  # ユーザー登録
  def create
    @user = User.new(user_params)
    if @user.save
      token = SecureRandom.hex(18)
      Redis.current.set(token, @user.id)
      render json: { token: token }
    else
      render json: { messages: @user.errors }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end