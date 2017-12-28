class MainController < ApplicationController
  before_action :authenticate_user!
  def index
    user_session[:routestart]=nil
    user_session[:routestop]=nil
  end

  def routestart
  end

  def routestart_create
    redirect routestop_path
  end

  def routestop
  end

  def routestop_create
    redirect root_path
  end

end
