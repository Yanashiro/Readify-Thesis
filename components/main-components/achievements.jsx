import React, { useState, useEffect } from 'react'
import lockedImage from '../../images/locked.png'
import firstSteps from '../../images/first_steps.png'
import getAHang from '../../images/getting_the_hang_of_it.png'
import marathon from '../../images/marathon_reader.png'
import comprehensionStart from '../../images/comprehension_starter.png'
import sharpRead from '../../images/sharp_reader_2.png'
import ieltsStar from '../../images/IELTS_star.png'
import perfectScore from '../../images/perfect_score.png'
import elite from '../../images/elite_achiever.png'
import './achievements.css'
import axios from 'axios'

function Achievements() {

	const [unlocked, setUnlocked] = useState({})

	const achievementList = [
		{ name: 'First Steps', desc: 'Completed first reading test', img: firstSteps },
		{ name: 'Getting the Hang of it', desc: 'Completed 5 tests', img: getAHang },
		{ name: 'Marathon Reader', desc: 'Completed 10 tests', img: marathon },
		{ name: 'Comprehension Starter', desc: 'Scored 50% or higher in a test', img: comprehensionStart },
		{ name: 'Sharp Reader', desc: 'Scored 75% or higher in a test', img: sharpRead },
		{ name: 'IELTS Star', desc: 'Scored 90% or higher in a test', img: ieltsStar },
		{ name: 'Perfect Score', desc: 'Scored 100% in one test', img: perfectScore },
		{ name: 'Elite Achiever', desc: 'Unlocked all achievements', img: elite }
	]

	useEffect(() => {

		axios
			.get('/achievements', { withCredentials: true })
			.then((res) => {

				const unlockedMap = {}

				res.data.data.forEach(a => {
					unlockedMap[a.title] = true
				})

				setUnlocked(unlockedMap)

			})
			.catch((err) => console.error(err))

	}, [])

	return (
		<main className='achievements-main'>

			<div className='achievements-title'>
				<h1>Achievements</h1>
			</div>

			<div>

				{achievementList.map((ach) => (

					<div className="container" key={ach.name}>

						<img
							src={unlocked[ach.name] ? ach.img : lockedImage}
							width="80px"
							height="80px"
							alt={ach.name}
						/>

						<div className='achievements-name-center'>
							<p className="p-b"><b>{ach.name}</b></p>
							<p className="p-a">{ach.desc}</p>
						</div>

					</div>

				))}

			</div>

		</main>
	)
}

export default Achievements