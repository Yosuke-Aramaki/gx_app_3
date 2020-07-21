class Api::V1::ArticlesController < ApplicationController
  def test
    render plain: current_user.inspect
  end
end
