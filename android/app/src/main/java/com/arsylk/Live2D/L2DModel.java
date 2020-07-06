package com.arsylk.mammonsmite.Live2D;

import com.arsylk.mammonsmite.DestinyChild.DCModel;
import com.arsylk.mammonsmite.DestinyChild.DCModelInfo;
import com.arsylk.mammonsmite.utils.Utils;
import org.apache.commons.io.FileUtils;
import org.json.JSONObject;

import java.io.*;
import java.nio.charset.Charset;
import java.util.*;

public class L2DModel {
    private DCModel.DCModelJson modelJson;
    private File output;
    private String modelName, modelIdx;
    private JSONObject _modelJson = null, infoJson = null, infoBakJson = null;

    //constructors
    public L2DModel(String model) {
        load(new File(model));
    }

    public L2DModel(File model) {
        load(model);
    }

    public L2DModel(File output, DCModel.DCModelJson modelJson) {
        this.output = output;
        this.modelJson = modelJson;
        this.modelIdx = modelJson.getModelIdx();
        this.modelName = DCModelInfo.getInstance().getModelFull(modelIdx);
    }


    //methods
    private void load(File model) {
        //fail safe
        if(model.isDirectory())
            model = new File(model, "model.json");
        modelJson = new DCModel.DCModelJson(Utils.fileToJson(model));

        //only if correct model
        if(modelJson.isLoaded()) {
            modelIdx = modelJson.getModelIdx();
            output = model.getParentFile();

            if(getModelConfig().exists()) {
                //load from saved file
                _modelJson = Utils.fileToJson(getModelConfig());
                if(_modelJson != null) {
                    if(_modelJson.has("model_name") && _modelJson.has("model_id")) {
                        try {
                            modelIdx = _modelJson.getString("model_id");
                            modelName = _modelJson.getString("model_name");
                        }catch(Exception e) {
                            e.printStackTrace();
                        }
                    }
                    if(_modelJson.has("model_info")) {
                        try {
                            infoJson = _modelJson.getJSONObject("model_info");
                            infoBakJson = _modelJson.getJSONObject("model_info_bak");
                        }catch(Exception e) {
                            return;
                        }
                    }
                }
            }else {
                //load default params
                modelName = DCModelInfo.getInstance().getModelFull(modelIdx);
            }
        }
    }

    public synchronized void generateModel() {
        try{
            //generate json
            JSONObject _model = new JSONObject()
                    .put("model_id", modelIdx)
                    .put("model_name", modelName);
            if(infoJson != null) {
                _model.put("model_info", infoJson);
            }
            if(infoBakJson != null) {
                _model.put("model_info_bak", infoBakJson);
            }

            //write json to file
            FileUtils.write(getModelConfig(), _model.toString(4), Charset.forName("utf-8"));
        }catch(Exception e) {
            e.printStackTrace();
        }
    }


    //setters
    public void setOutput(File output) {
        this.output = output;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public void setModelInfoJson(JSONObject infoJson) {
        this.infoJson = infoJson;
    }

    public void setModelInfoBakJson(JSONObject infoBakJson) {
        this.infoBakJson = infoBakJson;
    }


    //getters
    public boolean isLoaded() {
        return modelJson.isLoaded() && modelIdx != null;
    }

    public String getModelId() {
        return modelIdx;
    }

    public String getModelName() {
        return modelName != null ? modelName : getModelId();
    }

    public JSONObject getModelConfigJson() {
        return _modelJson != null ? _modelJson : new JSONObject();
    }

    public JSONObject getModelInfoJson() {
        return infoJson != null ? infoJson : new JSONObject();
    }

    public JSONObject getModelInfoBakJson() {
        return infoBakJson != null ? infoBakJson : new JSONObject();
    }

    //getters files
    public File getOutput() {
        return output;
    }

    public File getModelHeader() {
        return new File(output, "_header");
    }

    public File getModelConfig() {
        return new File(output, "_model");
    }

    public File getModel() {
        return new File(output, "model.json");
    }

    public File getCharacter() {
        return new File(output, modelJson.getModel());
    }

    public File[] getTextures() {
        File[] textures = new File[modelJson.getTextures().length];
        for(int i = 0; i < modelJson.getTextures().length; i++) {
            textures[i] = new File(output, modelJson.getTextures()[i]);
        }
        return textures;
    }

    public File[] getMotions() {
        List<String> motions = new ArrayList<>(modelJson.getMotions().values());
        File[] motionFiles = new File[motions.size()];
        for(int i = 0; i < motionFiles.length; i++) {
            motionFiles[i] = new File(output, motions.get(i));
        }
        return motionFiles;
    }

    public File getMotion(String name) {
        if(modelJson.getMotions().containsKey(name)) {
            return new File(output, modelJson.getMotions().get(name));
        }
        return null;
    }

    public File[] getExpressions() {
        List<String> expressions = new ArrayList<>(modelJson.getExpressions().values());
        File[] expressionFiles = new File[expressions.size()];
        for(int i = 0; i < expressionFiles.length; i++) {
            expressionFiles[i] = new File(output, expressions.get(i));
        }
        return expressionFiles;
    }

    public File getExpression(String name) {
        if(modelJson.getExpressions().containsKey(name)) {
            return new File(output, modelJson.getExpressions().get(name));
        }
        return null;
    }
}
