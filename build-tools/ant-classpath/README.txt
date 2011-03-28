Use this tasks to include libs into ant by extending the classpath of ant on runtime.
This avoids including the libs into the lib directory of ant as well as the application classpath etc.

Example:

    <target name="-init.ftptask" unless="ftptask.initialized">
        <taskdef resource="com/cenqua/ant/antlib.xml" classpath="${dir.tools}/ant-clover/etc/cenquatasks.jar"/>
        <extendclasspath path="${dir.tools}/ant-optional/commons-net-1.4.1.jar"/>
        <extendclasspath path="${dir.tools}/ant-optional/jakarta-oro-2.0.8.jar"/>
        <available property="ftptask.initialized" classname="org.apache.commons.net.ftp.FTPClientConfig"/>
    </target>
