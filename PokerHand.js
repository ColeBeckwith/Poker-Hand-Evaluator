const Result = { "win": 1, "loss": 2, "tie": 3 };
const CardRank = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const CardOrder = ['A', ...CardRank];

function PokerHand(hand) {
	let cardArray = hand.split(' ');
	this.cardNumbers = getCardBreakdownByNumber(cardArray);

	this.flush = checkFlush(cardArray);
	this.straight = checkStraight(cardArray);

	if (this.flush && this.straight) {
		this.rank = 9;
		this.tiebreakOne = this.cardNumbers.lastIndexOf(1);
		return;
	}

	if (this.flush) {
		this.rank = 6;
		this.tiebreakOne = this.cardNumbers.lastIndexOf(1);
		this.tiebreakTwo = this.cardNumbers.lastIndexOf(1, this.tiebreakOne - 1);
		this.tiebreakThree = this.cardNumbers.lastIndexOf(1, this.tiebreakTwo - 1);
		this.tiebreakFour = this.cardNumbers.lastIndexOf(1, this.tiebreakThree - 1);
		this.tiebreakFive = this.cardNumbers.lastIndexOf(1, this.tiebreakFour - 1);
		return;
	}

	if (this.straight) {
		this.rank = 5;
		this.tiebreakOne = this.cardNumbers.lastIndexOf(1);
		return;
	}

	if (this.cardNumbers.indexOf(4) !== -1) {
		this.rank = 8;
		this.tiebreakOne = this.cardNumbers.indexOf(4);
		this.tiebreakTwo = this.cardNumbers.indexOf(1);
		return;
	}

	if (this.cardNumbers.indexOf(3) !== -1) {
		this.tiebreakOne = this.cardNumbers.indexOf(3);
		if (this.cardNumbers.indexOf(2) !== -1) {
			this.rank = 7;
			this.tiebreakTwo = this.cardNumbers.indexOf(2);
		} else {
			this.rank = 4;
			this.tiebreakTwo = this.cardNumbers.lastIndexOf(1);
			this.tiebreakThree = this.cardNumbers.indexOf(1);
		}
		return;
	}

	if (this.cardNumbers.indexOf(2) !== -1) {
		if (this.cardNumbers.indexOf(2) !== this.cardNumbers.lastIndexOf(2)) {
			this.rank = 3;
			this.tiebreakOne = this.cardNumbers.lastIndexOf(2);
			this.tiebreakTwo = this.cardNumbers.indexOf(2);
			this.tiebreakThree = this.cardNumbers.indexOf(1);
			return;
		}
		this.rank = 2;
		this.tiebreakOne = this.cardNumbers.indexOf(2);
		this.tiebreakTwo = this.cardNumbers.lastIndexOf(1);
		this.tiebreakThree = this.cardNumbers.lastIndexOf(1, this.tiebreakTwo - 1);
		this.tiebreakFour = this.cardNumbers.lastIndexOf(1, this.tiebreakThree - 1);
		return;
	}

	if (!this.rank) {
		this.rank = 1;
		this.tiebreakOne = this.cardNumbers.lastIndexOf(1);
		this.tiebreakTwo = this.cardNumbers.lastIndexOf(1, this.tiebreakOne - 1);
		this.tiebreakThree = this.cardNumbers.lastIndexOf(1, this.tiebreakTwo - 1);
		this.tiebreakFour = this.cardNumbers.lastIndexOf(1, this.tiebreakThree - 1);
		this.tiebreakFive = this.cardNumbers.lastIndexOf(1, this.tiebreakFour - 1);
	}
}

function getCardBreakdownByNumber(cards) {
	let arr = [];
	for (let i = 0; i < CardRank.length; i++) {
		arr[i] = 0;
		for (let j = 0; j < cards.length; j++) {
			if (cards[j][0] === CardRank[i]) {
				arr[i]++;
			}
		}
	}
	return arr;
}

function checkFlush(cards) {
	let suit = cards[0][1];
	for (let i = 1; i < cards.length; i++) {
		if (cards[i][1] !== suit) {
			return false;
		}
	}
	return true;
}

function checkStraight(cards) {
	let numInRow = 0;
	for (let i = 0; i < CardOrder.length; i++) {
		let matched = false;
		for (let j = 0; j < cards.length; j++) {
			if (cards[j][0] === CardOrder[i]) {
				matched = true;
			}
		}
		if (matched) {
			numInRow++;
			if (numInRow === 5) {
				return true;
			}
		} else {
			numInRow = 0;
		}
	}
	return false;
}

PokerHand.prototype.compareWith = function(hand) {
	this.rankingArray = [this.rank, this.tiebreakOne, this.tiebreakTwo, this.tiebreakThree, this.tiebreakFour, this.tiebreakFive];
	const handRankingArray = [hand.rank, hand.tiebreakOne, hand.tiebreakTwo, hand.tiebreakThree, hand.tiebreakFour, hand.tiebreakFive];

	for (let i = 0; i < handRankingArray.length; i++) {
		if (this.rankingArray[i] > handRankingArray[i]) {
			return Result.win;
		} else if (this.rankingArray[i] < handRankingArray[i]) {
			return Result.loss;
		}
	}

	return Result.tie;
};