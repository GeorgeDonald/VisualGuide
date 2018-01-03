class ViewSequencesController < ApplicationController
  before_action :authenticate_user!

  def video
    filename = ""
    save_uploaded_file(params[:data],'video',filename)
    render :json => {}
  end

  def sequence
    render :json => {}
  end

  private
  def save_uploaded_file(fileobj, filepath, filename)
    complete_path = "#{Rails.public_path}/#{filepath}"
    FileUtils.mkdir_p(complete_path) unless File.exists?(complete_path)
    begin
      f = File.open(complete_path + "/" + filename, "a+b")
      f.write(fileobj.read)
    rescue
      return false
    ensure
      f.close unless f.nil?
    end
    true
  end
end
