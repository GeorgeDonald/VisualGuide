require 'test_helper'

class ViewSequencesControllerTest < ActionDispatch::IntegrationTest
  test "should get video" do
    get view_sequences_video_url
    assert_response :success
  end

  test "should get sequence" do
    get view_sequences_sequence_url
    assert_response :success
  end

end
