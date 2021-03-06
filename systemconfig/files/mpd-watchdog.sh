#!/bin/bash
paused=false
if [[ $(mpc) == *paused* ]]
then
	paused="true"
else
	paused="false"
fi
while : ; do
        mpc idle >> /dev/null
		while [[ ( ( $(mpc) == *paused* ) && ( $paused == "true" ) ) || ( ( $(mpc) == *playing* ) && ( $paused == "false" ) ) ]] ; do
		        mpc idle >> /dev/null
		done
		if [[ $(mpc) == *paused* ]]
		then
			paused="true"
			curl -H 'Content-Type: application/json' -X PUT -d '{"service":"mpd", "playback":"false"}' localhost:3000/playback
		else
			paused="false"
			curl -H 'Content-Type: application/json' -X PUT -d '{"service":"mpd", "playback":"true"}' localhost:3000/playback
		fi
done
