package de.exxcellent.echolot.webcontainer.sync.component;

import de.exxcellent.echolot.SharedService;
import de.exxcellent.echolot.app.RegexComponent;
import nextapp.echo.app.Component;
import nextapp.echo.app.util.Context;
import nextapp.echo.webcontainer.ServerMessage;
import nextapp.echo.webcontainer.service.JavaScriptService;
import nextapp.echo.webcontainer.sync.component.TextComponentPeer;
import nextapp.echo.webcontainer.Service;
import nextapp.echo.webcontainer.WebContainerServlet;

public abstract class RegexComponentPeer extends TextComponentPeer {
    public static final Service REGEX_COMPONENT_SYNC_SERVICE;

    static {
        REGEX_COMPONENT_SYNC_SERVICE = JavaScriptService.forResource("exxcellent.RegexComponent.Sync",
                "js/Sync.RegexField.js");
        WebContainerServlet.getServiceRegistry().add(REGEX_COMPONENT_SYNC_SERVICE);
    }


    public RegexComponentPeer() {
        super();
        addOutputProperty(RegexComponent.PROPERTY_REGEX);
        addOutputProperty(RegexComponent.PROPERTY_REGEX_MISMATCH_BORDER);
        addOutputProperty(RegexComponent.PROPERTY_REGEX_MISMATCH_FOREGROUND);
    }

    @Override
    public String getClientComponentType(boolean shortType) {
        return "exxcellent.RegexComponent";
    }

    @Override
    public Class getComponentClass() {
        return RegexComponent.class;
    }

    @Override
    public Object getOutputProperty(Context context, Component component, String propertyName, int propertyIndex) {
        final RegexComponent regexComponent = (RegexComponent) component;
        if (propertyName.equals(RegexComponent.PROPERTY_REGEX)) {
            return regexComponent.getRegex();
        } else if (propertyName.equals(RegexComponent.PROPERTY_REGEX_MISMATCH_BORDER)) {
            return regexComponent.getRegexMismatchBorder();
        } else if (propertyName.equals(RegexComponent.PROPERTY_REGEX_MISMATCH_FOREGROUND)) {
            return regexComponent.getRegexMismatchForeground();
        } else {
            return super.getOutputProperty(context, component, propertyName, propertyIndex);
        }
    }

    @Override
    public void init(Context context, Component component) {
        super.init(context, component);
        final ServerMessage serverMessage = (ServerMessage) context.get(ServerMessage.class);
        serverMessage.addLibrary(SharedService.ECHOCOMPONENTS_SERVICE.getId());

        serverMessage.addLibrary(REGEX_COMPONENT_SYNC_SERVICE.getId());
    }
}
