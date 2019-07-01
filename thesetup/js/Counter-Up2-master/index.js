const counterUp = ( el, options = {} ) => {

    const { 
        action = 'start', 
        duration = 1000, 
        delay = 16, 
        lang = undefined 
    } = options

    // Allow people to use this as a stop method.
    if ( action === 'stop' ) {
        stopCountUp( el )
        return
    }

	stopCountUp( el )

	// If no number, don't do anything.
	if ( ! /[0-9]/.test( el.innerHTML ) ) {
		return
	}

    const nums = divideNumbers( el.innerHTML, { 
        duration: duration || el.getAttribute( 'data-duration' ),
        lang: lang || document.querySelector( 'html' ).getAttribute( 'lang' ) || undefined,
        delay: delay || el.getAttribute( 'data-delay' ),
    } )

	// Remember the contents.
	el._countUpOrigInnerHTML = el.innerHTML

    // Start counting.
	el.innerHTML = nums[ 0 ]
	el.style.visibility = 'visible'

	// Function for displaying output with the set time and delay.
	const output = function() {
		el.innerHTML = nums.shift()
		if ( nums.length ) {
			clearTimeout( el.countUpTimeout )
			el.countUpTimeout = setTimeout( output, delay )
		} else {
			el._countUpOrigInnerHTML = undefined
		}
	}
	el.countUpTimeout = setTimeout( output, delay )
}

export default counterUp

const stopCountUp = el => {
    clearTimeout( el.countUpTimeout )
    if ( el._countUpOrigInnerHTML ) {
        el.innerHTML = el._countUpOrigInnerHTML
        el._countUpOrigInnerHTML = undefined
    }
    el.style.visibility = ''
}

export const divideNumbers = ( num, options = {} ) => {

    const { 
        duration = 1000, 
        delay = 16, 
        lang = undefined 
    } = options

	// Number of times the number will change.
	const divisions = duration / delay

	// Split numbers and html tags.
    const splitValues = num.toString().split( /(<[^>]+>|[0-9.][,.0-9]*[0-9]*)/ )

	// Contains all numbers to be displayed.
	const nums = []

	// Set blank strings to ready the split values.
	for ( let k = 0; k < divisions; k++ ) {
		nums.push( '' )
	}

	// Loop through all numbers and html tags.
	for ( let i = 0; i < splitValues.length; i++ ) {
		// If number split it into smaller numbers and insert it to nums.
		if ( /([0-9.][,.0-9]*[0-9]*)/.test( splitValues[ i ] ) && ! /<[^>]+>/.test( splitValues[ i ] ) ) {
			let num = splitValues[ i ]

			// Test if numbers have comma.
			const isComma = /[0-9]+,[0-9]+/.test( num )

			// Remove comma for computation purposes.
			num = num.replace( /,/g, '' )

			// Test if values have point.
			const isFloat = /^[0-9]+\.[0-9]+$/.test( num )

			// Check number of decimals places.
			const decimalPlaces = isFloat ? ( num.split( '.' )[ 1 ] || [] ).length : 0

			// Start adding numbers from the end.
			let k = nums.length - 1

			// Create small numbers
			for ( let val = divisions; val >= 1; val-- ) {
                let newNum = parseInt( num / divisions * val, 10 )

				// If has decimal point, add it again.
				if ( isFloat ) {
					newNum = parseFloat( num / divisions * val ).toFixed( decimalPlaces )
					newNum = parseFloat( newNum ).toLocaleString( lang )
				}

				// If has comma, add it again.
				if ( isComma ) {
					newNum = newNum.toLocaleString( lang )
				}

				// Insert all small numbers.
				nums[ k-- ] += newNum
			}
		} else {
			// Insert all non-numbers in the same place.
			for ( let k = 0; k < divisions; k++ ) {
				nums[ k ] += splitValues[ i ]
			}
		}
	}

	// The last value of the element should be the original one.
    nums[ nums.length ] = num.toString()
    
    return nums
}

export const hasComma = num => /[0-9]+,[0-9]+/.test( num )

export const isFloat = num => /^[0-9]+\.[0-9]+$/.test( num )

export const decimalPlaces = num => isFloat( num ) ? ( num.split( '.' )[ 1 ] || [] ).length : 0