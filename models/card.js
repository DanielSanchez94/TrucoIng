/*
* Matrix used to calculate the card weight in the Truco game
*   weigth - card
*      13  -  1 espada
*      12  -  1 basto
*      11  -  7 espada
*      10  -  7 oro
*       9  -  3
*       8  -  2
*       7  -  1 copa
*       7  -  1 oro
*       6  -  12
*       5  -  11
*     	4  -  10
*       3  -  7 copa
*       3  -  7 basto
*       2  -  6
*       1  -  5
*       0  -  4
*/
var weight = {
  'oro':    [ 7, 8, 9, 0, 1, 2, 10, 0, 0, 4, 5, 6],
  'copa':   [ 7, 8, 9, 0, 1, 2,  3, 0, 0, 4, 5, 6],
  'espada': [13, 8, 9, 0, 1, 2, 11, 0, 0, 4, 5, 6],
  'basto':  [12, 8, 9, 0, 1, 2,  3, 0, 0, 4, 5, 6]
};

/*
 * This is the Card Object
 *   @number: the number representing the card number
 *   @suit: this is the card suit
 */
function Card(number, suit){
  this.number = number;
  this.suit = suit;
  this.weight = weight[suit][number-1]; //arreglo comienza en la posicion cero
};

/*
 *  Print a card
 */
Card.prototype.show = function(){
  return this.number + ": " + this.suit;
};

/*
 * Compares two cards
 *   @card: the card to compare this
 *
 * Returns:
 *   1 if this card is better than 'card',
 *   0 if are equal and
 *   -1 if it's worst
 */


//Black Card
Card.prototype.isBlack = function(){
  return this.number == 11 || this.number == 12 || this.number == 10;
};

//Points
Card.prototype.puntos = function(card){
		if(this.suit == card.suit) {
			if(this.isBlack() && card.isBlack())
				return 20;
			else if(this.isBlack() || card.isBlack())
				if(this.isBlack())
					return 20 + card.number;
				else 
					return this.number + 20;
			else
				return (this.number + card.number + 20);
		}
		else{
			if(this.isBlack() && card.isBlack())
				return 0;
			else if(this.isBlack() || card.isBlack())
				if(this.isBlack())
					return card.number;
				else 
					return this.number;
			else 
				return Math.max(this.number, card.number);
	 }
};

module.exports.card = Card;

