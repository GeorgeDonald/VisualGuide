class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :getStreetViewUrl, :getCurUserPos, :getCurUserStrtViewUrl
  before_action :set_verify_cookie

  def set_verify_cookie
    #action cable needs a way outside of controller logic to lookup a user
    return unless current_user
    cookies.signed[:current_user_id] = current_user.id
  end

  def getStreetViewUrl(latitude, longitude, heading = 0, pitch = 0)
    if user_signed_in? && current_user.google_api_key
      "https://maps.googleapis.com/maps/api/streetview?size=640x480&fov=120&location=#{latitude},#{longitude}&heading=#{heading}&pitch=#{pitch}&key=#{current_user.google_api_key}"
    else
      "/current_positions/streetview?location=#{latitude},#{longitude}&heading=#{heading}&pitch=#{pitch}"
    end
  end

  def getCurUserPos
    latitude = 38.89990405669855
    longitude = -77.0362358156126
    heading = 180
    pitch = 32
    if(user_signed_in? && current_user.current_position)
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
