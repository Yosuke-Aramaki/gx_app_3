module Api
  module V1
    class Api::V1::UsersController < ApplicationController
      def index
        render json: {
          msg: "Hello!!!!!"
        }
      end

      def create
        logger.debug(params[:user].inspect)
        @user = User.new(user_params)
        if @user.save
          render json: { user_id: @user }
        else
          render json: { messages: "エラー" }, status: :unauthorized
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end
    end
  end 
end