export const timeStringToMilliseconds = (timeString) => {
	nums = timeString.split(':')
	if(nums.length !== 2) return -1
	return 1000*((parseInt(nums[0])*60)+parseInt(nums[1]))
}

export const padToTwo = (s) => {
	return (s+'').length == 1 ? '0' + s : s + ''
}
	
export const seconds = (timeInMilliseconds) => {
	let val = (Math.floor(timeInMilliseconds/1000)) % 60
	return val ? padToTwo(val)+'' : '00'
}

export const minutes = (timeInMilliseconds) => {
	let val = ((Math.floor(timeInMilliseconds/1000)) - seconds(timeInMilliseconds))/60
	return val ? padToTwo(val) : '00'
}
 
export const stringify = (timeInMilliseconds) => {
	return minutes(timeInMilliseconds) + ':' + seconds(timeInMilliseconds)
}

export const isValidTimeString = (timeString) => {
  var result = true
  var nums = timeString.split(':')
  if(nums.length !== 2 || nums[0].length > 2 || nums[0].length == 0 || nums[1].length != 2 || timeStringToMilliseconds(timeString) < 0) {
    result = false
  }
  return result
}