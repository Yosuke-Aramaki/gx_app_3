class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate, only: [:create]
  
  def new
  end

  # ログイン
  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      token = SecureRandom.hex(18)
      Redis.current.set(token, user.id)
      render json: { token: token }
    else
      render json: { messages: "メールまたはパスワードが一致しません"}, status: :unauthorized
    end
  end

  def destroy
    user_token = request.headers[:HTTP_AUTHORIZATION].slice!(6..44)
    Redis.current.del( user_token )
    render json: { status: user_token }
  end

end