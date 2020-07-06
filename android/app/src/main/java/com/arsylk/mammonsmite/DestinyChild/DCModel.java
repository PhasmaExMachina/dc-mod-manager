package com.arsylk.mammonsmite.DestinyChild;

import com.arsylk.mammonsmite.Live2D.L2DModel;
import com.arsylk.mammonsmite.utils.Utils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;

import static com.arsylk.mammonsmite.DestinyChild.DCDefine.*;


public class DCModel extends Pck {
    public static class DCModelJson {
        private JSONObject json;
        private boolean tested = false, loaded = false;
        private String modelIdx;

        private String model;
        private String[] textures;
        private LinkedHashMap<String, String> motions, expressions;

        public DCModelJson(JSONObject json) {
            this.json = json;
            this.tested = test();
            if(isTested()) {
                this.loaded = load();
            }
        }

        private boolean test() {
            if(json != null) {
                if(json.has("model") && json.has("textures") && json.has("motions")) {
                   return true;
                }
            }
            return false;
        }

        private boolean load() {
            try {
                //character.dat
                model = json.getString("model");
                //textures
                JSONArray jsonTextures = json.getJSONArray("textures");
                textures = new String[jsonTextures.length()];
                for(int i = 0; i < textures.length; i++) {
                    textures[i] = jsonTextures.getString(i);
                }
                //motions
                JSONObject jsonMotions = json.getJSONObject("motions");
                Iterator<String> jsonMotionsKeys = jsonMotions.keys();
                List<String> listKeys = new ArrayList<>();
                while(jsonMotionsKeys.hasNext()) {
                    listKeys.add(jsonMotionsKeys.next());
                }
                Collections.sort(listKeys, new Comparator<String>() {
                    @Override
                    public int compare(String t1, String t2) {
                        return t1.toLowerCase().compareTo(t2.toLowerCase());
                    }
                });
                motions = new LinkedHashMap<>();
                for(String key : listKeys) {
                    motions.put(key, jsonMotions.getJSONArray(key).getJSONObject(0).getString("file"));
                }
                //expressions
                expressions = new LinkedHashMap<>();
                if(json.has("expressions")) {
                    JSONArray jsonExpressions = json.getJSONArray("expressions");
                    for(int i = 0; i < jsonExpressions.length(); i++) {
                        JSONObject jsonExp = jsonExpressions.getJSONObject(i);
                        expressions.put(jsonExp.getString("name"), jsonExp.getString("file"));
                    }
                }
                //model idx
                for(String motion : motions.values()) {
                    if(motion.split("_").length > 2) {
                        modelIdx = motion.substring(0, motion.indexOf("_", motion.indexOf("_")+1));
                        break;
                    }
                }

                return true;
            }catch(Exception e) {
                e.printStackTrace();
            }
            return false;
        }

        //getters
        public boolean isTested() {
            return tested;
        }

        public boolean isLoaded() {
            return loaded;
        }

        public String getModelIdx() {
            return isLoaded() ? modelIdx : null;
        }

        public String getModel() {
            return isLoaded() ? model : null;
        }

        public String[] getTextures() {
            return isLoaded() ? textures : null;
        }

        public LinkedHashMap<String, String> getMotions() {
            return isLoaded() ? motions : null;
        }

        public LinkedHashMap<String, String> getExpressions() {
            return isLoaded() ? expressions : null;
        }
    }

    private boolean loaded = false;
    private DCModelJson modelJson;
    private PckFile modelFile;
    private PckFile[] modelTextures;
    private PckFile modelCharacter;
    private Map<String, PckFile> modelMotions;

    //constructors
    public DCModel(Pck pck) {
        super(pck);
        loaded = loadAsModel();
        generateHeader();
    }


    //methods
    private boolean loadAsModel() {
        //try get model json
        if(tryGetModelJson()) {
            //try get textures
            if(tryGetTextures()) {
                //try get character
                if(tryGetCharacter()) {
                    //try get motions
                    if(tryGetMotions()) {
                        //try ignore get expressions
                        tryGetExpressions();
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean tryGetModelJson() {
        long maxSize = 0L;
        PckFile maxFile = null;
        for(PckFile pckFile : getFiles(HASH_MODEL_OR_TEXTURE, JSON)) {
            long testSize = pckFile.getFile().length();
            if(testSize > maxSize) {
                maxSize = testSize;
                maxFile = pckFile;
            }
        }

        DCModelJson testModelJson;
        if(maxFile != null) {
            testModelJson = new DCModelJson(Utils.fileToJson(maxFile.getFile()));
            if(testModelJson.isTested() && testModelJson.isLoaded()) {
                modelJson = testModelJson;
                maxFile.rename("model.json");
                modelFile = maxFile;
                return true;
            }
        }
        for(PckFile pckFile : getFiles(JSON)) {
            testModelJson = new DCModelJson(Utils.fileToJson(pckFile.getFile()));
            if(testModelJson.isTested() && testModelJson.isLoaded()) {
                modelJson = testModelJson;
                pckFile.rename("model.json");
                modelFile = pckFile;
                return true;
            }
        }
        return false;
    }

    private boolean tryGetTextures() {
        try {
            List<PckFile> pckTextures = getFiles(HASH_MODEL_OR_TEXTURE, PNG);
            String[] jsonTextures = modelJson.getTextures();
            if(pckTextures.size() < jsonTextures.length) {
                pckTextures = getFiles(PNG);
            }
            modelTextures = new PckFile[jsonTextures.length];
            for(int i = 0; i < jsonTextures.length; i++) {
                pckTextures.get(i).rename(jsonTextures[i]);
                modelTextures[i] = pckTextures.get(i);
            }
            return true;
        }catch(Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private boolean tryGetCharacter() {
        try {
            for(PckFile pckFile : getFiles(HASH_CHARACTER, DAT)) {
                pckFile.rename(modelJson.getModel());
                modelCharacter = pckFile;
                return true;
            }
            for(PckFile pckFile : getFiles(DAT)) {
                pckFile.rename(modelJson.getModel());
                modelCharacter = pckFile;
                return true;
            }
        }catch(Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private boolean tryGetMotions() {
        //try blind get mtn
        try {
            modelMotions = new HashMap<>();
            Iterator<Map.Entry<String, String>> mtnJson = modelJson.getMotions().entrySet().iterator();
            for(PckFile mtnFile : getFiles(MTN)) {
                if(mtnJson.hasNext()) {
                    Map.Entry<String, String> entry = mtnJson.next();
                    mtnFile.rename(entry.getValue());
                    modelMotions.put(entry.getKey(), mtnFile);
                }
            }
            return true;
        }catch(Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private boolean tryGetExpressions() {
        //blind try get exp
        try {
            if(modelJson.getExpressions() != null) {
                Iterator<Map.Entry<String, String>> expJson = modelJson.getExpressions().entrySet().iterator();
                for(PckFile expFile : getFiles(JSON)) {
                    if(!expFile.getFile().getName().equals("model.json") && expJson.hasNext()) {
                        Map.Entry<String, String> entry = expJson.next();
                        expFile.rename(entry.getValue());
                    }
                }
                //TODO usage of expressions
            }
            return true;
        }catch(Exception e) {
            e.printStackTrace();
        }
        return false;

    }

    public L2DModel asL2DModel() {
        return isLoaded() ? new L2DModel(output, modelJson) : null;
    }


    //getters
    public boolean isLoaded() {
        return loaded;
    }

    public PckFile getModelFile() {
        return modelFile;
    }
}
