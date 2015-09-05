module.exports = function (expressValidator) {
	
	expressValidator.validator.extend('isInRange', function (str, min, max) {
		
		// check if value is numeric
		var isNumber = !isNaN(parseFloat(str)) && isFinite(str);
		var input;
		
		// if the input is not a number, return false, as the value cannot be within the specified range
		if (!isNumber) {
			return false;
		}
		
		// convert input to a number, now check ranges
		input = parseInt(str);
		if (input < min) {
			return false;
		}
		
		if (input > max) {
			return false;
		}
		
		// passed all tests
		return true;
 
	});
 
};