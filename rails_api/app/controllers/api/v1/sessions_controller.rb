class Api::V1::SessionsController < ApplicationController
  def new
  end

  # ログイン
  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      render json: { user_id: user.id }
    else
      render json: { messages: "メールまたはパスワードが一致しません"}, status: :unauthorized
    end
  end

end