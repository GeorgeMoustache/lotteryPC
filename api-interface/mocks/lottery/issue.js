/**
 * 购彩-期号
 *
 * @url lottery/issue.action?category="CQSSC"
 *
 */

module.exports = ({
	method,
	query,
	body
}) => {
	let { category } = query
	if (/HKSIX$/.test(category)) {
		return {
			'code': 0,
			'msg': '',
			'curIssue': '2018044',
      'openIssue': '2018043',
      'lastEndTime': function() {
        return '2019-01-18 15:10:30';
      },
			'endTime': function() {
        return '2019-01-18 15:22:00';
				var d = new Date();
				d.setSeconds(d.getSeconds() + 700, 0)
				// return '2017-10-26 21:30:00'
				return d.toJSON().split('T')[0] + ' ' + d.toTimeString().split(' ')[0]
			},
			'openNum|1': ['06,16,11,01,08,12,41', '']
		}
	}
	if (/28$/.test(category)) {
		return {
			'code': 0,
			'msg': '',
			'curIssue': '0719033',
			'openIssue': '0719032',
			'openNum|1': ['1,3,5', '0,1,3', '3,7,9']
		}
	}
	return {
		'code': 0,
		'msg': '',
		'curIssue': 20180320265,
		'openIssue': 20180320264,
		'openNum': function() {
			switch (category) {
				case 'CQSSC':
				case 'SFSSC':
				case 'TJSSC':
					return ''
					break;
				case 'BJPK10':
					return '01,08,05,03,09,04,02,06,07,10'
					break;
			}
		}
	}
}
