class ViewSequencesController < ApplicationController
  before_action :authenticate_user!

  def video
    record = Record.find(params[:record_id])
    if(record)
      if(record.file_name.empty?)
        now = Time.now
        record.file_name = "#{current_user.id}_#{params[:record_id]}_#{now.year}#{now.month}#{now.day}#{now.hour}#{now.min}#{now.sec}.mp4"
        record.save
      }
      save_uploaded_file(params[:data],'video',record.file_name)
    end
    render :json => {}
  end

  def sequence
    vs = ViewSequence.new(user_id: current_user.id,
      record_id: params[:record_id], latitude: params[:latitude],
      longitude: params[:longitude], heading: params[:heading], pitch: params[:pitch])
    vs.save
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
