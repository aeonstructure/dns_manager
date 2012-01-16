package serializationstrategies;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;

/**
 * Marks a field for exclusion in serialization
 */
public class ExcludeForLightSerializationStrategy implements ExclusionStrategy {

    @Override
    public boolean shouldSkipClass(Class<?> c) {
        return false;
    }

    @Override
    public boolean shouldSkipField(FieldAttributes f) {
        return f.getAnnotation(ExposeForLightSerialization.class) == null && f.getAnnotation(javax.persistence.Id.class) == null;
    }

}