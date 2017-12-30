class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :getStreetViewUrl, :getCurUserPos, :getCurUserStrtViewUrl

  def getStreetViewUrl(latitude, longitude, heading = 0, pitch = 0)
    "https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120&location=#{latitude},#{longitude}&heading=#{heading}&pitch=#{pitch}&key=#{current_user.google_api_key}"
  end

  def getCurUserPos
    latitude = 39.95259199321605
    longitude = -75.16522200000003
    heading = 0
    pitch = 0
    if(current_user.current_position)
      latitude = current_user.current_position.latitude
      longitude = current_user.current_position.longitude
      heading = current_user.current_position.heading
      pitch = current_user.current_position.pitch
    end
    {latitude: latitude, longitude: longitude, heading: heading, pitch: pitch}
  end

  def getCurUserStrtViewUrl
    pos = getCurUserPos
    getStreetViewUrl(pos[:latitude],pos[:longitude],pos[:heading],pos[:pitch])
  end
end
