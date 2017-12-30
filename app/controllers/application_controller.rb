class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :getStreetViewUrl

  def getStreetViewUrl(latitude, longitude, heading = 0, pitch = 0)
    "https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120&location=#{latitude},#{longitude}&heading=#{heading}&pitch=#{pitch}&key=#{current_user.google_api_key}"
  end
end
