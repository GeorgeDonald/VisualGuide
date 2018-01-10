class MainController < ApplicationController
  def index
    @current_position = CurrentPosition.new
  end
end
