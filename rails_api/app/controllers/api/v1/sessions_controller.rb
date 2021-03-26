class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate, only: [:create, :update]

  def new
  end

  # ログイン
  def create
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      token = SecureRandom.hex(18)
      Redis.current.set(token, @user.id)
      render json: { token: token }
    else
      render json: { messages: "メールまたはパスワードが一致しません"}, status: :unauthorized
    end
  end

  # パスワード更新
  def update
    if @user = User.find_by(email: params[:session][:email].downcase)
      request_token = SecureRandom.hex(18)

      redis = Redis.new
      redis.multi do
        Redis.current.set(request_token, @user.id)
        Redis.current.expire(request_token, 216000)
      end

      render json: { token: request_token }
    else
      render json: { messages: "メールアドレスが登録されていません"}, status: :unauthorized
    end
  end

  def destroy
    user_token = request.headers[:HTTP_AUTHORIZATION].slice!(6..44)
    Redis.current.del( user_token )
    render json: { status: user_token }
  end

end