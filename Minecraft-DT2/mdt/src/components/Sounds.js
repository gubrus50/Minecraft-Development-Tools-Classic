const playSound = (sound_name) => {
  if (sound_name == 'btn-press') {
    let audio = new Audio('btn-press.mp3');
    		audio.currentTime = 0.6;
    		audio.play();
  }
}

export default playSound