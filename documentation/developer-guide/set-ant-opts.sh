#!/bin/sh
#
# sets the debug and echo dumping
#
export ANT_OPTS='-Decho.syncdump=true -Decho.javascript.compression.enabled=false -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005'

