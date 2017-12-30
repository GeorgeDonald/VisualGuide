class MainController < ApplicationController
  before_action :authenticate_user!
  def index
    @current_position = CurrentPosition.new
  end
end
