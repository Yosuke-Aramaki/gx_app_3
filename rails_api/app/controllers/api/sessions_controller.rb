module Api
  module V1
    class SessionsController < ApplicationController
      def new
      end
    
      def create
        user = User.find_by(email: params[:session][:email].downcase)
        if user && user.authenticate(params[:session][:password])
          log_in user
          redirect_to root_url
        else
          flash.now[:danger] = 'ログインに失敗しました'
          render 'new'
        end
      end
    
    end
  end
end