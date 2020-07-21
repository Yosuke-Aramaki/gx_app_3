class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate

  protected
  def authenticate
    authenticate_or_request_with_http_token do |token,options|
      @current_user = User.find_by(id: token)
      @current_user != nil ? true : false
    end
  end

  def current_user
    @current_user
  end

end
