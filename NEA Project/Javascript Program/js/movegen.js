
// Function to build a move together
function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}