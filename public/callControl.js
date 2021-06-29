// some call control functionalities, e.g. mute / unmute, turn on / off camera
// not finished

// mute/unmute audio
const onMuteButtonClick = (event) => {

 room.localParticipant.audioTracks.forEach((publication) => {
   const audioTrack = publication.track;
   audioTrack.disable(); //mute the audio track
 });

 toggleAudioButtons();
};

const onUnmuteButtonClick = (event) => {

 room.localParticipant.audioTracks.forEach((publication) => {
 	const audioTrack = publication.track;
 	audioTrack.enable();
 });
 
 toggleAudioButtons();
 }

const onStopVideoClick = (event) => {

 room.localParticipant.videoTracks.forEach((publication) => {
 	const videoTrack = publication.track;
 	videoTrack.disable(); //diable video track
 });

 toggleVideoButtons();
};

const onStartVideoButtonClick = (event) => {

 room.localParticipant.videoTracks.forEach((publication) => {
   const videoTrack = publication.track;
   videoTrack.enable(); //enable video track
 });

 toggleVideoButtons();
};

const toggleAudioButtons = () => {
 document.getElementById("muteAudio").classList.toggle("hidden");
 document.getElementById("unmuteAudio").classList.toggle("hidden");
};

const toggleVideoButtons = () => {
 document.getElementById("stopVideo").classList.toggle("hidden");
 document.getElementById("startVideo").classList.toggle("hidden");
};